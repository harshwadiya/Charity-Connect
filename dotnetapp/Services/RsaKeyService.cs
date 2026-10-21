using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Text;

namespace dotnetapp.Services
{
    public class RsaKeyService
    {
        private readonly RSA _rsa;

        public RsaKeyService()
        {
            _rsa = RSA.Create(2048);
        }

        public string GetPublicKey()
        {
            return Convert.ToBase64String(_rsa.ExportSubjectPublicKeyInfo());
        }

        public string Decrypt(string encryptedBase64)
        {
            try
            {
                var encryptedBytes = Convert.FromBase64String(encryptedBase64);
                var decryptedBytes = _rsa.Decrypt(encryptedBytes, RSAEncryptionPadding.Pkcs1);
                return Encoding.UTF8.GetString(decryptedBytes);
            }
            catch (Exception ex )
            {
                throw new Exception("Password decryption failed: "+ ex.Message);
            }
        }
    }
}